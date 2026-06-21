import { useState } from 'react'
import { Input, Select, Textarea } from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'
import ImageUpload from '../ui/ImageUpload.jsx'

const EMPTY = {
  name: '', category: 'Historical', region: '', address: '',
  shortDescription: '', description: '',
  images: [], openingHours: '', entryFee: '',
  rating: 4.0, tags: '',
}

export default function AttractionForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, images: initial.images || [], tags: (initial.tags || []).join(', ') }
      : EMPTY
  )

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      rating: Number(form.rating),
      images: form.images,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Sigiriya Rock Fortress" />

      <div className="grid grid-cols-2 gap-3">
        <Select label="Category" value={form.category} onChange={e => set('category', e.target.value)}>
          {['Historical', 'Scenic', 'Beach', 'Cultural', 'Wildlife'].map(c => <option key={c}>{c}</option>)}
        </Select>
        <Input label="Region" value={form.region} onChange={e => set('region', e.target.value)} required placeholder="e.g. Central" />
      </div>

      <Input label="Full Address" value={form.address} onChange={e => set('address', e.target.value)} placeholder="e.g. Sigiriya, Matale District, Central Province, Sri Lanka" />
      <Input label="Short Description" value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} placeholder="One-line summary" />
      <Textarea label="Full Description" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Opening Hours" value={form.openingHours} onChange={e => set('openingHours', e.target.value)} placeholder="7:00 AM – 5:30 PM" />
        <Input label="Entry Fee" value={form.entryFee} onChange={e => set('entryFee', e.target.value)} placeholder="USD 30 / Free" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Rating (0–5)" type="number" value={form.rating} onChange={e => set('rating', e.target.value)} min={0} max={5} step={0.1} />
        <Input label="Tags (comma-separated)" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="UNESCO, Hiking" />
      </div>

      <ImageUpload value={form.images.filter(Boolean)} onChange={v => set('images', v)} />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={saving}>
          {saving ? <Spinner className="w-4 h-4" /> : 'Save Attraction'}
        </Button>
      </div>
    </form>
  )
}
