"use client"

export default function StatsBar() {
  const stats = [
    { label: "Proverbs", value: "2,847" },
    { label: "Contributors", value: "1,234" },
    { label: "Countries", value: "54" },
    { label: "Languages", value: "89" },
  ]

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
