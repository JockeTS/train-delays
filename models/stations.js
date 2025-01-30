const stations = {
    getStations: async function getStations() {
        const response = await fetch('https://trafik.emilfolino.se/stations', {
            headers: {
                'content-type': 'application/json'
            }
        });

        const result = await response.json();

        return result.data;
    }
};

export default stations;
