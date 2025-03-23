"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import "leaflet/dist/leaflet.css"

interface PartyMap {
  [statePo: string]: "DEMOCRAT" | "REPUBLICAN" | "OTHER"
}

export default function ElectionMapPage() {
  const [geoData, setGeoData] = useState<any>(null)

  // Dummy vote result mapping
  const voteResults: PartyMap = {
    AL: "REPUBLICAN",
    CA: "DEMOCRAT",
    TX: "REPUBLICAN",
    NY: "DEMOCRAT",
    FL: "REPUBLICAN",
    MI: "DEMOCRAT",
    OH: "REPUBLICAN",
    // Add more states as needed
  }

  useEffect(() => {
    fetch("/us-states.json")
      .then((res) => res.json())
      .then(setGeoData)
  }, [])

  const getFillColor = (statePo: string) => {
    const party = voteResults[statePo]
    if (party === "DEMOCRAT") return "blue"
    if (party === "REPUBLICAN") return "red"
    return "gray"
  }

  const onEachState = (feature: any, layer: any) => {
    const statePo = feature?.properties?.STATE
    const abbrev = feature?.properties?.STUSPS

    layer.setStyle({
      fillColor: getFillColor(abbrev),
      fillOpacity: 0.6,
      color: "#333",
      weight: 1,
    })

    layer.bindPopup(`<b>${feature.properties.NAME}</b><br/>Party: ${voteResults[abbrev] || "Unknown"}`)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">US States by Dominant Party</h2>
      <MapContainer
        center={[37.8, -96]}
        zoom={4}
        style={{ height: "500px", width: "100%", borderRadius: "10px", overflow: "hidden" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {geoData && <GeoJSON data={geoData} onEachFeature={onEachState} />}
      </MapContainer>
    </div>
  )
}
