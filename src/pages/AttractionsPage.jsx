import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAttractions } from '../hooks/useAttractions.js'
import AttractionForm from '../components/listings/AttractionForm.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import { Table, Th, Td, Tr } from '../components/ui/Table.jsx'

export default function AttractionsPage() {
  const { attractions, loading, create, update, remove } = useAttractions()
  const [modal, setModal]   = useState(null)
  const [saving, setSaving] = useState(false)

  const openCreate = () => setModal('create')
  const openEdit   = (a) => setModal(a)
  const closeModal = () => setModal(null)

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal === 'create') await create(data)
      else await update(modal._id, data)
      closeModal()
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this attraction?')) return
    try { await remove(id) } catch { alert('Delete failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attractions</h1>
        <Button size="sm" onClick={openCreate}><Plus size={16} /> Add Attraction</Button>
      </div>

      <Table loading={loading} empty={attractions.length === 0 ? 'No attractions yet.' : null}>
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
