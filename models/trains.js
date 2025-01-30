const trains = {
    getTrains: async function getTrains() {
        const response = await fetch('https://trafik.emilfolino.se/delayed', {
            headers: {
                'content-type': 'application/json'
            }
        });

        const result = await response.json();

        return result.data;
    }
};

export default trains;
