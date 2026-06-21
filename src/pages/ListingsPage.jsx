import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { useListings } from '../hooks/useListings.js'
import ListingForm from '../components/listings/ListingForm.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import { Table, Th, Td, Tr } from '../components/ui/Table.jsx'
import { formatCurrency, PRICE_UNIT_LABELS } from '../utils/formatters.js'

export default function ListingsPage() {
  const { listings, loading, create, update, remove } = useListings()
  const [modal, setModal]   = useState(null) // null | 'create' | listing object
  const [saving, setSaving] = useState(false)

  const openCreate = () => setModal('create')
  const openEdit   = (l) => setModal(l)
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
    if (!confirm('Delete this listing?')) return
    try { await remove(id) } catch { alert('Delete failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
        <Button size="sm" onClick={openCreate}><Plus size={16} /> Add Listing</Button>
      </div>

      <Table loading={loading} empty={listings.length === 0 ? 'No listings yet.' : null}>
        <thead><tr>
          <Th>Name</Th><Th>Type</Th><Th>Region</Th>
          <Th>Price</Th><Th>Active</Th><Th>Actions</Th>
        </tr></thead>
        <tbody>
          {listings.map(l => (
            <Tr key={l._id}>
              <Td className="font-medium text-gray-900">{l.name}</Td>
              <Td className="text-gray-500 capitalize">{l.listingType}</Td>
              <Td className="text-gray-500">{l.region}</Td>
              <Td>{formatCurrency(l.price?.amount)}<span className="text-gray-400 text-xs ml-1">{PRICE_UNIT_LABELS[l.price?.unit]}</span></Td>
              <Td>{l.active ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-400" />}</Td>
              <Td>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(l)} className="p-1.5 text-teal-500 hover:bg-teal-50 rounded-lg"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(l._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      {modal && (
        <Modal
          title={modal === 'create' ? 'Add Listing' : 'Edit Listing'}
          onClose={closeModal}
        >
          <ListingForm
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
