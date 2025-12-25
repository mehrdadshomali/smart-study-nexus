import {
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  TrendingUpIcon,
} from 'lucide-react'

const stats = [
  { label: 'Toplam Not', value: '0', icon: FileTextIcon, color: 'bg-blue-500' },
  { label: 'Klasör', value: '0', icon: FolderIcon, color: 'bg-purple-500' },
  { label: 'Soru', value: '0', icon: HelpCircleIcon, color: 'bg-green-500' },
  { label: 'Bugün Çalışma', value: '0 dk', icon: TrendingUpIcon, color: 'bg-orange-500' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Hoş geldin! Çalışmaya hazır mısın?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Hızlı Başla</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/notes/new"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <FileTextIcon className="h-8 w-8 text-indigo-500" />
            <div>
              <p className="font-medium text-slate-900">Yeni Not</p>
              <p className="text-sm text-slate-600">Not oluştur ve düzenle</p>
            </div>
          </a>
          <a
            href="/questions"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <HelpCircleIcon className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-medium text-slate-900">Soru Ekle</p>
              <p className="text-sm text-slate-600">Çalışma sorusu oluştur</p>
            </div>
          </a>
          <a
            href="/quiz"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <TrendingUpIcon className="h-8 w-8 text-purple-500" />
            <div>
              <p className="font-medium text-slate-900">Quiz Başlat</p>
              <p className="text-sm text-slate-600">Kendini test et</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Son Aktivite</h2>
        <div className="text-center py-8 text-slate-500">
          <p>Henüz aktivite yok.</p>
          <p className="text-sm">İlk notunu oluşturarak başla!</p>
        </div>
      </div>
    </div>
  )
}
