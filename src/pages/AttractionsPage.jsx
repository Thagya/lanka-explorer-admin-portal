import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { useAttractions, useAttractionDetail } from '../hooks/useAttractions.js'
import AttractionForm from '../components/listings/AttractionForm.jsx'
import AttractionDetailDrawer from '../components/listings/AttractionDetailDrawer.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import { Table, Th, Td, Tr } from '../components/ui/Table.jsx'

export default function AttractionsPage() {
  const { attractions, loading, error: loadError, create, update, remove } = useAttractions()
  const [modal, setModal]         = useState(null)   // null | 'create' | attraction object
  const [viewId, setViewId]       = useState(null)
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState('')
  const [actionError, setActionError] = useState('')

  const { detail, loading: detailLoading, error: detailError } = useAttractionDetail(viewId)

  const openCreate = () => { setModal('create'); setSaveError('') }
  const openEdit   = (a) => { setModal(a); setSaveError(''); setViewId(null) }
  const closeModal = () => { setModal(null); setSaveError('') }
  const openView   = (id) => setViewId(id)
  const closeView  = () => setViewId(null)

  const handleSave = async (data) => {
    setSaving(true)
    setSaveError('')
    try {
      if (modal === 'create') await create(data)
      else await update(modal._id, data)
      closeModal()
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save attraction')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this attraction?')) return
    setActionError('')
    closeView()
    try {
      await remove(id)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete attraction')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attractions</h1>
        <Button size="sm" onClick={openCreate}><Plus size={16} /> Add Attraction</Button>
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-4">
          {loadError}
        </div>
      )}

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-4">
          {actionError}
        </div>
      )}

      <Table loading={loading} empty={!loadError && attractions.length === 0 ? 'No attractions yet.' : null}>
        <thead><tr>
          <Th>Name</Th>
          <Th className="hidden sm:table-cell">Category</Th>
          <Th className="hidden md:table-cell">Region</Th>
          <Th>Rating</Th>
          <Th>Actions</Th>
        </tr></thead>
        <tbody>
          {attractions.map(a => (
            <Tr key={a._id}>
              <Td>
                <p className="font-medium text-gray-900">{a.name}</p>
                <p className="text-xs text-gray-400 sm:hidden mt-0.5">{a.category}</p>
              </Td>
              <Td className="hidden sm:table-cell text-gray-500">{a.category}</Td>
              <Td className="hidden md:table-cell text-gray-500">{a.region}</Td>
              <Td>
                {a.rating > 0
                  ? <span className="text-sm">⭐ {a.rating}</span>
                  : <span className="text-gray-400 text-xs">—</span>
                }
              </Td>
              <Td>
                <div className="flex gap-1">
                  <button onClick={() => openView(a._id)} className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg" title="View">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => openEdit(a)} className="p-1.5 text-teal-500 hover:bg-teal-50 rounded-lg" title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(a._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      {/* Detail drawer */}
      {viewId && (
        <AttractionDetailDrawer
          attraction={detail}
          loading={detailLoading}
          error={detailError}
          onClose={closeView}
          onEdit={() => { const a = attractions.find(x => x._id === viewId); if (a) openEdit(a) }}
          onDelete={() => handleDelete(viewId)}
        />
      )}

      {/* Create / Edit modal */}
      {modal && (
        <Modal
          title={modal === 'create' ? 'Add Attraction' : 'Edit Attraction'}
          onClose={closeModal}
        >
          {saveError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-sm mb-4">
              {saveError}
            </div>
          )}
          <AttractionForm
            initial={modal === 'create' ? null : modal}
            onSave={handleSave}
            onCancel={closeModal}
            saving={saving}
          />
        </Modal>
      )}
    </div>
  )
}
