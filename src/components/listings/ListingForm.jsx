import { useState } from 'react'
import { Input, Select, Textarea } from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'
import ImageUpload from '../ui/ImageUpload.jsx'

const EMPTY = {
  listingType: 'hotel',
  name: '', region: '', description: '',
  images: [],
  price: { amount: '', unit: 'per_night', currency: 'LKR' },
  active: true,
}

export default function ListingForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() => initial ? { ...initial, images: initial.images || [] } : EMPTY)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setPrice = (k, v) => setForm(f => ({ ...f, price: { ...f.price, [k]: v } }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      price: { ...form.price, amount: Number(form.price.amount) },
      images: form.images,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Listing Name" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Sigiriya Heritage Villa" />

      <div className="grid grid-cols-2 gap-3">
        <Select label="Type" value={form.listingType} onChange={e => set('listingType', e.target.value)}>
          <option value="hotel">Hotel</option>
          <option value="tour">Tour</option>
          <option value="vehicle">Vehicle</option>
        </Select>
        <Input label="Region" value={form.region} onChange={e => set('region', e.target.value)} required placeholder="e.g. Kandy" />
      </div>

      <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} required rows={3} placeholder="Describe this listing..." />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Price (LKR)" type="number" value={form.price.amount} onChange={e => setPrice('amount', e.target.value)} required min={0} />
        <Select label="Price Unit" value={form.price.unit} onChange={e => setPrice('unit', e.target.value)}>
          <option value="per_night">Per Night</option>
          <option value="per_person">Per Person</option>
          <option value="per_day">Per Day</option>
        </Select>
      </div>

      <ImageUpload value={form.images.filter(Boolean)} onChange={v => set('images', v)} />

      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="w-4 h-4 accent-teal-500" />
        Active (visible to customers)
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={saving}>
          {saving ? <Spinner className="w-4 h-4" /> : 'Save Listing'}
        </Button>
      </div>
    </form>
  )
}
