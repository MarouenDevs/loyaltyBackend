let riders = {};
const riderStatus = [
    {
        'min': 0,
        'max': 20,
        'mutiplicator': 1,
        'state': 'bronze'
    },
    {
        'min': 20,
        'max': 50,
        'mutiplicator': 3,
        'state': 'silver'

    },
    {
        'min': 50,
        'max': 100,
        'mutiplicator': 5,
        'state': 'gold',
    },
    {
        'min': 100,
        'mutiplicator': 10,
        'state': 'platinuim',

    }
];


const ACTIONS = {

    UPDATE_STATE: 'UPDATE_STATE',
    UPDATE_PAYED: 'UPDATE_PAYED',
    UPDATE_PHONE: 'UPDATE_PHONE'


}

const filterState = (nb) => {
    return riderStatus.filter((state) => {
        if (state.max) {
            return (nb >= state.min && (state.max && nb < state.max))
        } else {
            return (nb >= state.min);
        }


    });
}


const updateRider = (rider, playload, action) => {

    switch (action) {
        case ACTIONS.UPDATE_PAYED: {
            rider.payed = parseFloat(rider.payed + rider.amount).toFixed(2);
            return rider;
        }
        case ACTIONS.UPDATE_STATE: {
            rider.nbRides = parseInt(rider.nbRides) + 1;
            let newState = filterState(rider.nbRides)[0];
            rider.state = newState.state;
            rider.payed = parseFloat(rider.payed + playload.amount).toFixed(2);
            rider.points = parseFloat(rider.points + (playload.amount * newState.mutiplicator)).toFixed(2);
            return rider;
        }
        case ACTIONS.UPDATE_PHONE: {
            rider.phonenumber = playload.phone_number;
            return rider;
        }
        default: {
            throw 'warning !! weird action';
        }

    }


}

const initRider = (payload,rider_id) => {

    const rider = {
        name: (payload.name ? payload.name : ''),
        rider_id:rider_id,
        phonenumber: (payload.phone_number? payload.phone_number:''),
        state: 'bronze',
        nbRides: 1,
        payed: (payload.amount ? payload.amount : 0),
        points: (payload.amount ? payload.amount : 0)

    }
    return rider;
}

class Process {

    constructor() {
        this.eventMap = {
            'rider_signed_up': this.riderSignUp,
            'rider_updated_phone_number': this.riderUpdatePhoneNumber,
            'ride_created': this.rideCreated,
            'ride_completed': this.rideCompleted
        };


    }

    listen(socket, data) {
        const type = data.type;

        if (this.eventMap.hasOwnProperty(type)) {
            console.log(data);
              let rider = this.eventMap[type](socket, data.payload);

                console.log(rider);
                socket.emit('rider', rider);


        }


    }


    rideCreated(socket, payload) {

        let rider = {};
        if (riders && riders.hasOwnProperty(payload.rider_id)) {
            // update
            rider = updateRider(riders[payload.rider_id], payload, ACTIONS.UPDATE_STATE);
            riders[payload.rider_id] = rider;
        } else {
            // create
            rider = initRider(payload,payload.rider_id);
            riders[payload.rider_id] = rider;

        }
        return rider;

    }

    riderUpdatePhoneNumber(socket, payload) {
        let rider = {};
        if (riders && riders.hasOwnProperty(payload.id)) {
            // update
            rider = updateRider(riders[payload.id], payload, ACTIONS.UPDATE_PHONE);
            riders[payload.id] = rider;
        }else{

            rider = initRider(payload,payload.id);
            riders[payload.id] = rider;
        }
        return rider;

    }

    rideCompleted(socket, payload) {
        let rider = {};
        if (riders && riders.hasOwnProperty(payload.rider_id)) {
            // update
            rider = updateRider(riders[payload.rider_id], payload, ACTIONS.UPDATE_STATE);
            riders[payload.rider_id] = rider;


        } else {
            // create
            rider = initRider(payload,payload.rider_id);
            riders[payload.rider_id] = rider;
        }
        return rider;


    }

    riderSignUp(socket, payload) {
        let rider = {};
        // create
        rider = initRider(payload,payload.id);
        riders[payload.id] = rider;

        return rider;


    }
}

module.exports = {Process};