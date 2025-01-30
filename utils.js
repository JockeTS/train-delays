// Filter out delayed trains without departure data
function filterTrains(unfilteredArr) {
    const filteredArr = unfilteredArr.filter(function(train) {
        // Don't add to filtered array if no from location data
        if (train.FromLocation === undefined) {
            return false;
        }

        // Add to filtered array
        return true;
    });

    return filteredArr;
}

// Make sure there's only unique train ids in array
// The latest departure time is kept for each train id
// This is because the other entries are stops at other stations
// Which are not specified in the proxy API - making it useless information
function removeDuplicateTrains(arr) {
    for (const [index, train] of arr.entries()) {
        // Check if current train exists with a later departure date
        const duplicate = arr.slice(index + 1).find(obj => {
            return obj.AdvertisedTrainIdent == train.AdvertisedTrainIdent;
        });

        // Replace duplicate entry with empty string
        if (duplicate) {
            arr[index] = "";
        }
    }

    // Create a new array and populate it with non-empty objects
    const newArr = [];

    for (const train of arr) {
        if (train.length != 0) {
            newArr.push(train);
        }
    }

    return newArr;
}

function getStationNameFromCode(code, stations) {
    const stationName = stations.find(station => {
        return station.LocationSignature === code;
    }).AdvertisedLocationName;

    return stationName;
}

export { filterTrains, removeDuplicateTrains, getStationNameFromCode };
