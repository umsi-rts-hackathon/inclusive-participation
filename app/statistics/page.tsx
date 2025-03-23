"use client"



export default function StatisticsPage() {
  return (
    <div className="pl-16 md:pl-64 p-6 w-full h-screen box-border">
      <h1 className="text-2xl font-bold mb-4">Advanced Statistics Dashboard</h1>
      <div className="w-full h-[85vh] border rounded-md overflow-hidden">
        <iframe
          src="https://devchartsdatadriven.streamlit.app/?embed=true"
          className="w-full h-full rounded-md"
          style={{ border: "none" }}
        />
      </div>
    </div>
  )
}

