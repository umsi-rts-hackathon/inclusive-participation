"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSidebar } from "@/components/sidebar-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RegulationDetailPage() {
  const { id } = useParams()
  const { open } = useSidebar()
  const [document, setDocument] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [loadingDoc, setLoadingDoc] = useState(true)
  const [loadingComments, setLoadingComments] = useState(true)
  const [commentSearch, setCommentSearch] = useState("")

  // Fetch document details
  useEffect(() => {
    const fetchDocument = async () => {
      setLoadingDoc(true)
      try {
        const res = await fetch(`https://api.regulations.gov/v4/documents/${id}`, {
          headers: {
            "X-Api-Key": "aQeGz6NWXwlq2J3QXZVftr2d7avvoiRpUcDid7qq",
          },
        })
        const data = await res.json()
        setDocument(data.data?.attributes)
      } catch (e) {
        console.error("Document fetch error:", e)
      } finally {
        setLoadingDoc(false)
      }
    }

    fetchDocument()
  }, [id])

  // Fetch comments
  const fetchComments = async (term: string) => {
    setLoadingComments(true)
    try {
      const res = await fetch(
        `https://api.regulations.gov/v4/comments?filter[commentOnId]=${id}&filter[searchTerm]=${encodeURIComponent(
          term
        )}&page[size]=10&sort=-postedDate`,
        {
          headers: {
            "X-Api-Key": "aQeGz6NWXwlq2J3QXZVftr2d7avvoiRpUcDid7qq",
          },
        }
      )
      const data = await res.json()
      setComments(data.data || [])
    } catch (e) {
      console.error("Comment fetch error:", e)
    } finally {
      setLoadingComments(false)
    }
  }

  useEffect(() => {
    fetchComments(commentSearch)
  }, [id, commentSearch])

  const handleCommentSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchComments(commentSearch)
  }

  return (
    <div className={`${open ? "pl-64" : "pl-16"} pr-6 pt-6`}>
      <h1 className="text-2xl font-bold mb-4">Document Details</h1>

      {loadingDoc ? (
        <p>Loading document...</p>
      ) : document ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold">{document.title}</h2>
          <p className="text-sm text-gray-500 mt-2">
            Posted: {new Date(document.postedDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 mt-4">{document.docAbstract || "No summary available."}</p>
          <a
            href={`https://www.regulations.gov/document/${id}`}
            target="_blank"
            className="text-blue-600 underline mt-2 inline-block"
          >
            View full document on Regulations.gov →
          </a>
        </div>
      ) : (
        <p>Document not found.</p>
      )}

      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <form onSubmit={handleCommentSearch} className="flex gap-2 mb-4">
        <Input
          value={commentSearch}
          onChange={(e) => setCommentSearch(e.target.value)}
          placeholder="Search comments..."
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
            <li key={c.id} className="border p-4 rounded shadow-sm bg-white dark:bg-gray-900">
              <p className="text-sm text-gray-800 whitespace-pre-line">{c.attributes.comment}</p>
              <p className="text-xs text-gray-500 mt-2">
                Posted: {new Date(c.attributes.postedDate).toLocaleDateString()} | Tracking #: {c.attributes.trackingNbr}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
