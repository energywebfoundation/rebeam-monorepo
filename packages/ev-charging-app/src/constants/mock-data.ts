import ChargeStationImg from "../assets/BuildingImg.png"
export const mockData = {
  type: "FeatureCollection",
  features: [{
    type: "Feature",
    properties: {
      id: "123",
      stationName: "50 Hertz Tranzmission",
      formattedAddress: "Heidestraße 2, 10557 Berlin, Germany",
      img: ChargeStationImg 
    },
    geometry: {
      type: "Point",
      coordinates: [
        -346.61168932914734,
        52.520268590245536
      ]
    }
  },
  {
    type: "Feature",
    properties: {
      id: "456",
      stationName: " Charge Point 2",
      formattedAddress: "Heidestraße 2, 10557 Berlin, Germany",
      img: ChargeStationImg 
    },
    geometry: {
      type: "Point",
      coordinates: [
        -346.6189956665039,
        52.51667788396363
      ]
    }
  },
  {
    type: "Feature",
    properties: {
      id: "789",
      stationName: " Charge Point 3",
      formattedAddress: "Heidestraße 2, 10557 Berlin, Germany"
    },
    geometry: {
      type: "Point",
      coordinates: [
        -346.6217637062073,
        52.509234394590266
      ]
    }
  },
  {
    type: "Feature",
    properties: {
      id: "478",
      stationName: " Charge Point 4",
      formattedAddress: "Heidestraße 2, 10557 Berlin, Germany"
    },
    geometry: {
      type: "Point",
      coordinates: [
        -346.6044044494629,
        52.513439468094624
      ]
    }
  },
  {
    type: "Feature",
    properties: {
      id: "479",
      stationName: " Charge Point 5",
      formattedAddress: "Heidestraße 2, 10557 Berlin, Germany"
    },
    geometry: {
      type: "Point",
      coordinates: [
        -346.60725831985474,
        52.50698804138875
      ]
    }
  },
  {
    type: "Feature",
    properties: {
      id: "478",
      stationName: "Charge Point 6",
      formattedAddress: "Heidestraße 2, 10557 Berlin, Germany"
    },
    geometry: {
      type: "Point",
      coordinates: [
        -346.58552169799805,
          52.51355699542472
      ]
    }
  },
  {
    type: "Feature",
    properties: {
      id: "478",
      stationName: "Charge Point 7",
      formattedAddress: "Heidestraße 2, 10557 Berlin, Germany"
    },
    geometry: {
      type: "Point",
      coordinates: [
        -346.5978813171387,
        52.51846674522954
      ]
    }
  }
  ]
}