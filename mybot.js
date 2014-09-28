var calls = 0;

function new_game() {
}


function make_move() {

    calls++;

    console.log("Call #"+calls);
    //trace("Call #"+calls);
/*
    var board = get_board();

    // we found an item! take it!
    if (board[get_my_x()][get_my_y()] > 0) {
        return TAKE;
    }

    console.log(board);

    console.log("x: "+get_my_x());
    console.log("y: "+get_my_y);

    console.log("opponent x: "+get_opponent_x());
    console.log("opponent y: "+get_opponent_y());

    console.log("item types: "+get_number_of_item_types());

    var items = get_number_of_item_types();

    for (var i = 1; i <= items; i++) {

        console.log("Item ("+i+") Count: "+get_total_item_count(i));

    }*/

    var targetType = getTargetType();

    var targetPos = getTargetPos(targetType);

    var item = currentItem();

    // If there is an item on the spot

    if (item > 0) {

        // UNCOMMENT the following line if we want to take any time there is an item
        // COMMENT the following line if we don't want to take any time there is an item

        console.log("[MYCHOICE] TAKE");
        return TAKE;

        /*
        // If the item on the spot matches the target type, TAKE

        if (item == targetType) {

            console.log("[MYCHOICE] TAKE");
            return TAKE;

        }

        // If the opponent is on the same spot, TAKE

        else if (onSameSpot()) {

            console.log("[MYCHOICE] TAKE");
            return TAKE;

        }

        // If by using a move to pickup an item, we still can get to our targetType first, then pick up

        else if (targetPos.distanceTotal > getOpponentMovesToPos(targetPos) + 1) {

            console.log("[MYCHOICE] TAKE");
            return TAKE;

        }
        */

    }

    // If there is no item on the spot, or there is but we don't want to take it, then...

    // We have to choose whether to move along x-axis or y-axis

    var move = getChoiceXY(targetPos);

    if (move.x) {

        if (move.distance > 0) {

            console.log("[MYCHOICE] EAST");
            return EAST;

        }
        else {

            console.log("[MYCHOICE] WEST");
            return WEST;

        }

    }
    else if (move.y) {

        if (move.distance > 0) {

            console.log("[MYCHOICE] SOUTH");
            return SOUTH;

        }
        else {

            console.log("[MYCHOICE] NORTH");
            return NORTH;

        }

    }

    console.log("Error: should have returned something already");

    return EAST;

}

function currentItem() {

    // Returns true if an item exists at our current position, false otherwise

    return get_board()[get_my_x()][get_my_y()];

}

function getItemCountLeft(type) {

    return parseInt(parseFloat(get_total_item_count(type)) - get_my_item_count(type) - get_opponent_item_count(type));

}

function getItem(x, y) {

    return get_board()[x][y];

}

function getTargetType() {

    // Returns the target type

    /* Current Logic
        1) Return the type with the least occurrences that hasn't been won already by the opponent, and that we haven't already won, and that at least one still exists

     */

    var items = get_number_of_item_types();

    var type = -1;
    var minCount = 999999;

    for (var i = 1; i <= items; i++) {

        if (get_total_item_count(i) < minCount && !hasWonType(i) && !hasLostType(i) && getItemCountLeft(i) > 0) {
            type = i;
            minCount = get_total_item_count(i);
        }

    }

    return type;

}

function getTargetPos(type) {

    // Returns the position of the target with type

    /* Current Logic
        1) Go for the closest one
    */

    return getClosest(getPositions(type));

}

function getPositions(type) {

    // Returns an array of positions of type

    var positions = [];

    var board = get_board();

    var rows = board.length;
    var columns = board[0].length;

    for (var i = 0; i < rows; i++) {

        for (var j = 0; j < columns; j++) {

            if (board[i][j] == type) {

                var distanceX;
                var distanceY;

                distanceX =  i - get_my_x();
                distanceY = j - get_my_y();

                var totalMoves = Math.abs(distanceX) + Math.abs(distanceY);

                var newPos = { x:i, y:j, distanceX: distanceX, distanceY: distanceY, distanceTotal: totalMoves };

                positions.push(newPos);

            }

        }

    }

    return positions;

}

function getClosest(positions) {

    // Given a list of positions, returns the one with the least number of moves required, and that the opponent isn't standing on

    var minMovesRequired = 999999;
    var closestPosition;

    positions.forEach(function(position) {

        if (position.distanceTotal < minMovesRequired && !opponentOnSpot(position.x, position.y)) {

            minMovesRequired = position.distanceTotal;
            closestPosition = position;

        }

    });

    // If the list is exhausted (opponent is on the last occurrence probably, get the closest of any type

    // COMMENT if statements to go for the closest item of any type

    if (closestPosition == null || closestPosition == undefined) {

        positions = getPositionsAll();

    }

    positions.forEach(function(position) {

        if (position.distanceTotal < minMovesRequired && !opponentOnSpot(position.x, position.y)) {

            minMovesRequired = position.distanceTotal;
            closestPosition = position;

        }

    });

    return closestPosition;

}

function getPositionsAll() {

    // Returns an array of positions of all items on the board that the opponent is on

    var positions = [];

    var board = get_board();

    var rows = board.length;
    var columns = board[0].length;

    for (var i = 0; i < rows; i++) {

        for (var j = 0; j < columns; j++) {

            if (board[i][j] != 0) {

                var distanceX;
                var distanceY;

                distanceX =  i - get_my_x();
                distanceY = j - get_my_y();

                var totalMoves = Math.abs(distanceX) + Math.abs(distanceY);

                var newPos = { x:i, y:j, distanceX: distanceX, distanceY: distanceY, distanceTotal: totalMoves };

                positions.push(newPos);

            }

        }

    }

    return positions;


}

function getOpponentMovesToPos(position) {

    var distanceX =  position.x - get_opponent_x();
    var distanceY = position.y - get_opponent_y();

    return Math.abs(distanceX) + Math.abs(distanceY);

}

function getChoiceXY(targetPos) {

    // Given a target position, choose whether to move on x or y

    var move = { };

    var distanceX =  targetPos.distanceX / Math.abs(targetPos.distanceX);
    var distanceY = targetPos.distanceY / Math.abs(targetPos.distanceY);

    if (targetPos.distanceX == 0) {

        move = { x: false, y: true, distance: distanceY };

        return move;

    }
    else if (targetPos.distanceY == 0) {

        move = { x: true, y: false, distance: distanceX };

        return move;

    }

    var moveXType = getItem(get_my_x() + distanceX, get_my_y());
    var moveYType = getItem(get_my_x(), get_my_y() + distanceY);

    // If opponent is on one of these two choices, take the choice they're not on

    if (opponentOnSpot(get_my_x() + distanceX, get_my_y())) {

        move = { x: false, y: true, distance: distanceY };

        return move;

    }
    else if (opponentOnSpot(get_my_x(), get_my_y() + distanceY)) {

        move = { x: true, y: false, distance: distanceX };

        return move;

    }

    // If opponent is not on one of these two choices

    if (moveXType != 0 && moveYType != 0) {

        // If both choices would land on a spot with items, then...

        if (hasWonType(moveXType) || hasLostType(moveXType)) {

            // If the type landed on with an x-move is already decided, then move to Y
            // This would be default if both types were decided

            move = { x: false, y: true, distance: distanceY };

            return move;

        }
        else if (hasWonType(moveYType) || hasLostType(moveYType)) {

            // If the type landed on with an y-move is already decided, then move to X

            move = { x: true, y: false, distance: distanceX };

            return move;

        }
        else {

            // If both x and y move to a type that is undecided...

            // Pick the one that you have a larger percentage of (i.e. closer to winning)

            var moveXTypePercentageWin = get_my_item_count(moveXType) / parseFloat(get_total_item_count(moveXType));
            var moveYTypePercentageWin = get_my_item_count(moveYType) / parseFloat(get_total_item_count(moveYType));

            if (moveXTypePercentageWin > moveYTypePercentageWin) {

                move = { x: true, y: false, distance: distanceX};

                return move;

            }
            else {

                move = { x: false, y: true, distance: distanceY };

                return move;

            }

        }

    }
    else if (moveXType == 0) {

        move = { x: false, y: true, distance: distanceY };

        return move;

    }
    else if (moveYType == 0) {

        move = { x: true, y: false, distance: distanceX };

        return move;

    }

    // Else there's no items in either choice, so pick x by default
    // This logic seems okay when we focus on ourselves, but it would affect opponent calculations/logic
    // Hence a better implementation would further consider factors to pick x/y move if both next moves do not land on an item

    return { x: true, y: false, distance: distanceX };


}

function onSameSpot() {

    return (get_my_x() == get_opponent_x) && (get_my_y() == get_opponent_y());

}

function opponentOnSpot(x, y) {

    return (get_opponent_x() == x && get_opponent_y() == y);

}

function hasWonType(type) {

    return get_my_item_count(type) > (get_total_item_count(type) / 2);

}

function hasLostType(type) {

    return get_opponent_item_count(type) > (get_total_item_count(type) / 2);

}



// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}
