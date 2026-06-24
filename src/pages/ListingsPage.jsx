import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { useListings } from '../hooks/useListings.js'
import ListingForm from '../components/listings/ListingForm.jsx'
import Modal from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import { Table, Th, Td, Tr } from '../components/ui/Table.jsx'
import { formatCurrency, PRICE_UNIT_LABELS } from '../utils/formatters.js'

export default function ListingsPage() {
  const { listings, loading, error: loadError, create, update, remove } = useListings()
  const [modal, setModal]         = useState(null)
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState('')
  const [actionError, setActionError] = useState('')

  const openCreate = () => { setModal('create'); setSaveError('') }
  const openEdit   = (l) => { setModal(l); setSaveError('') }
  const closeModal = () => { setModal(null); setSaveError('') }

  const handleSave = async (data) => {
    setSaving(true)
    setSaveError('')
    try {
      if (modal === 'create') await create(data)
      else await update(modal._id, data)
      closeModal()
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save listing')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return
    setActionError('')
    try {
      await remove(id)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete listing')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
        <Button size="sm" onClick={openCreate}><Plus size={16} /> Add Listing</Button>
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

      <Table loading={loading} empty={!loadError && listings.length === 0 ? 'No listings yet.' : null}>
        <thead><tr>
          <Th>Name</Th>
          <Th className="hidden sm:table-cell">Type</Th>
          <Th className="hidden md:table-cell">Region</Th>
          <Th>Price</Th>
          <Th className="hidden sm:table-cell">Active</Th>
          <Th>Actions</Th>
        </tr></thead>
        <tbody>
          {listings.map(l => (
            <Tr key={l._id}>
              <Td>
                <p className="font-medium text-gray-900">{l.name}</p>
                <p className="text-xs text-gray-400 sm:hidden capitalize mt-0.5">{l.listingType}</p>
              </Td>
              <Td className="hidden sm:table-cell text-gray-500 capitalize">{l.listingType}</Td>
              <Td className="hidden md:table-cell text-gray-500">{l.region}</Td>
              <Td>{formatCurrency(l.price?.amount)}<span className="text-gray-400 text-xs ml-1">{PRICE_UNIT_LABELS[l.price?.unit]}</span></Td>
              <Td className="hidden sm:table-cell">{l.active ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-400" />}</Td>
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
          {saveError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-sm mb-4">
              {saveError}
            </div>
          )}
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
