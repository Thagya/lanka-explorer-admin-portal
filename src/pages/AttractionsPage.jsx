import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAttractions } from '../hooks/useAttractions.js'
import AttractionForm from '../components/listings/AttractionForm.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import { Table, Th, Td, Tr } from '../components/ui/Table.jsx'

export default function AttractionsPage() {
  const { attractions, loading, error: loadError, create, update, remove } = useAttractions()
  const [modal, setModal]     = useState(null)
  const [saving, setSaving]   = useState(false)
  const [saveError, setSaveError] = useState('')
  const [actionError, setActionError] = useState('')

  const openCreate = () => { setModal('create'); setSaveError('') }
  const openEdit   = (a) => { setModal(a); setSaveError('') }
  const closeModal = () => { setModal(null); setSaveError('') }

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
          <Th>Name</Th><Th>Category</Th><Th>Region</Th><Th>Rating</Th><Th>Actions</Th>
        </tr></thead>
        <tbody>
          {attractions.map(a => (
            <Tr key={a._id}>
              <Td className="font-medium text-gray-900">{a.name}</Td>
              <Td className="text-gray-500">{a.category}</Td>
              <Td className="text-gray-500">{a.region}</Td>
              <Td>⭐ {a.rating}</Td>
              <Td>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(a)} className="p-1.5 text-teal-500 hover:bg-teal-50 rounded-lg"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(a._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

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
