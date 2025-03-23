"use client"

import { useEffect, useState } from "react"
import { useSidebar } from "@/components/sidebar-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Document {
  id: string
  title: string
  postedDate: string
  documentType: string
}

export default function RegulationsPage() {
  const { open } = useSidebar()
  const [searchTerm, setSearchTerm] = useState("climate")
  const [query, setQuery] = useState("climate")
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  const [expandedDoc, setExpandedDoc] = useState<any | null>(null)
  const [comments, setComments] = useState<any[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentSearch, setCommentSearch] = useState("")

  const API_KEY = "aQeGz6NWXwlq2J3QXZVftr2d7avvoiRpUcDid7qq"

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://api.regulations.gov/v4/documents?filter[searchTerm]=${encodeURIComponent(query)}&sort=-postedDate&page[size]=10`,
          {
            headers: { "X-Api-Key": API_KEY },
          }
        )
        const data = await res.json()
        const results = data.data?.map((doc: any) => ({
          id: doc.id,
          title: doc.attributes.title,
          postedDate: doc.attributes.postedDate,
          documentType: doc.attributes.documentType,
        })) || []
        setDocs(results)
      } catch (error) {
        console.error("Failed to fetch documents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocs()
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(searchTerm)
    setExpandedDoc(null)
  }

  const expandDocument = async (id: string) => {
    if (expandedDoc?.id === id) {
      setExpandedDoc(null)
      return
    }

    try {
      const res = await fetch(`https://api.regulations.gov/v4/documents/${id}`, {
        headers: { "X-Api-Key": API_KEY },
      })
      const data = await res.json()
      setExpandedDoc({ id, ...data.data?.attributes })
      fetchComments(id, commentSearch)
    } catch (err) {
      console.error("Failed to fetch document details:", err)
    }
  }

  const fetchComments = async (docId: string, term: string) => {
    setLoadingComments(true)
    try {
      const res = await fetch(
        `https://api.regulations.gov/v4/comments?filter[commentOnId]=${docId}&filter[searchTerm]=${encodeURIComponent(
          term
        )}&sort=-postedDate&page[size]=10`,
        {
          headers: { "X-Api-Key": API_KEY },
        }
      )
      const data = await res.json()
      setComments(data.data || [])
    } catch (err) {
      console.error("Failed to fetch comments:", err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleCommentSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (expandedDoc?.id) {
      fetchComments(expandedDoc.id, commentSearch)
    }
  }

  return (
    <div className={`${open ? "pl-64" : "pl-16"} pr-6 pt-6`}>
      <h1 className="text-2xl font-bold mb-4">Search Regulatory Documents</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for regulations (e.g., water, climate, FDA)..."
          className="max-w-md"
        />
        <Button type="submit">Search</Button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : docs.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="space-y-4">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className="border p-4 rounded shadow-sm bg-white dark:bg-gray-900 cursor-pointer"
              onClick={() => expandDocument(doc.id)}
            >
              <h2 className="text-lg font-semibold text-blue-600 hover:underline">{doc.title}</h2>
              <p className="text-sm text-gray-500">
                Posted: {new Date(doc.postedDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700">Type: {doc.documentType}</p>

              {expandedDoc?.id === doc.id && (
                <div className="mt-4">
                  <p className="text-sm mt-2 whitespace-pre-wrap">
                    {expandedDoc.docAbstract || "No summary available."}
                  </p>
                  <a
                    href={`https://www.regulations.gov/document/${doc.id}`}
                    target="_blank"
                    className="text-blue-500 underline mt-2 inline-block"
                  >
                    View full document on Regulations.gov →
                  </a>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Comments</h3>
                    <form onSubmit={handleCommentSearch} className="flex gap-2 mb-4">
                      <Input
                        value={commentSearch}
                        onChange={(e) => setCommentSearch(e.target.value)}
                        placeholder="Search comments..."
                        className="max-w-md"
                      />
                      <Button type="submit">Search</Button>
                    </form>

                    {loadingComments ? (
                      <p>Loading comments...</p>
                    ) : comments.length === 0 ? (
                      <p>No comments found.</p>
                    ) : (
                      <ul className="space-y-4">
                        {comments.map((c) => (
                          <li
                            key={c.id}
                            className="border p-3 rounded bg-muted dark:bg-gray-800 text-sm"
                          >
                            <p className="whitespace-pre-line">{c.attributes.comment}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Posted:{" "}
                              {new Date(c.attributes.postedDate).toLocaleDateString()} | Tracking #:{" "}
                              {c.attributes.trackingNbr}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
