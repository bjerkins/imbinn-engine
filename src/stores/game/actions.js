import firebase from 'firebase/app';
import 'firebase/database';

import {
    CREATE_GAME_REQUEST,
    CREATE_GAME_SUCCESS,
    GET_GAME_REQUEST,
    GET_GAME_SUCCESS,
    GET_GAME_FAILURE,
} from './actions.types';

export const createGame = (id, rounds) => async (dispatch) => {
    dispatch({ type: CREATE_GAME_REQUEST });

    const gameData = {
        id,
        createdAt: Date.now(),
        currentRound: 0,
        startedAt: null,
        rounds,
    };
    const newGameRef = firebase.database().ref('/games').push();
    newGameRef.set(gameData);
    dispatch({ type: CREATE_GAME_SUCCESS });
};

export const getGame = id => (dispatch) => {
    dispatch({ type: GET_GAME_REQUEST });
    firebase.database()
        .ref('/games')
        .orderByChild('id')
        .equalTo(id)
        .on('value', (snapshot) => {
            const game = snapshot.val();
            if (!game) {
                dispatch({ type: GET_GAME_FAILURE });
            }

            const key = Object.keys(game)[0];

            dispatch({
                type: GET_GAME_SUCCESS,
                data: {
                    key,
                    ...game[key],
                },
            });
        });
};

export const startGame = gameKey => () => {
    firebase.database()
        .ref(`/games/${gameKey}/startedAt`)
        .set(Date.now());
};