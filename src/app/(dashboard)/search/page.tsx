'use client'

import { useState } from 'react'
import { SearchIcon, FileTextIcon, HelpCircleIcon, FolderIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<unknown[]>([])

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    // TODO: Gerçek API çağrısı
    // const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
    // const data = await response.json()
    // setResults(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ara</h1>
        <p className="text-slate-600">Notlarda, sorularda ve klasörlerde ara</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          type="search"
          placeholder="Aramak istediğiniz kelimeyi yazın..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-12 h-12 text-lg bg-white"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium">
          Tümü
        </button>
        <button className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200">
          <FileTextIcon className="h-4 w-4 inline mr-1" />
          Notlar
        </button>
        <button className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200">
          <HelpCircleIcon className="h-4 w-4 inline mr-1" />
          Sorular
        </button>
        <button className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200">
          <FolderIcon className="h-4 w-4 inline mr-1" />
          Klasörler
        </button>
      </div>

      {/* Results */}
      {query && results.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
          <SearchIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Sonuç bulunamadı
          </h3>
          <p className="text-slate-600">
            &quot;{query}&quot; için sonuç bulunamadı. Farklı bir arama deneyin.
          </p>
        </div>
      ) : !query ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
          <SearchIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Aramaya başla
          </h3>
          <p className="text-slate-600">
            Notlarında, sorularında ve klasörlerinde arama yap
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Results will be rendered here */}
        </div>
      )}
    </div>
  )
}
