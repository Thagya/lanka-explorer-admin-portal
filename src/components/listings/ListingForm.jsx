import { useState } from 'react'
import { Input, Select, Textarea } from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'
import ImageUpload from '../ui/ImageUpload.jsx'

const EMPTY = {
  listingType: 'hotel',
  name: '', region: '', address: '', description: '',
  images: [],
  price: { amount: '', unit: 'per_night', currency: 'LKR' },
  rating: '',
  active: true,
  options: {},
}

const toLines = (arr = []) => arr.join('\n')
const fromLines = (str = '') => str.split('\n').map(s => s.trim()).filter(Boolean)

function optToText(type, options = {}) {
  if (type === 'hotel') return { roomTypes: toLines(options.roomTypes), amenities: toLines(options.amenities) }
  if (type === 'tour')  return { includes: toLines(options.includes) }
  return {}
}

function textToOptions(type, text) {
  if (type === 'hotel') return { roomTypes: fromLines(text.roomTypes), amenities: fromLines(text.amenities) }
  if (type === 'tour')  return { includes: fromLines(text.includes) }
  return {}
}

export default function ListingForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, images: initial.images || [], rating: initial.rating ?? '' }
      : EMPTY
  )
  const [optText, setOptText] = useState(() =>
    initial ? optToText(initial.listingType, initial.options) : optToText('hotel', {})
  )

  const set = (k, v) => {
    if (k === 'listingType') setOptText(optToText(v, {}))
    setForm(f => ({ ...f, [k]: v }))
  }
  const setPrice = (k, v) => setForm(f => ({ ...f, price: { ...f.price, [k]: v } }))
  const setOpt   = (k, v) => setOptText(t => ({ ...t, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      price:   { ...form.price, amount: Number(form.price.amount) },
      rating:  Number(form.rating) || 0,
      images:  form.images,
      options: textToOptions(form.listingType, optText),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Listing Name" value={form.name} required
        onChange={e => set('name', e.target.value)}
        placeholder="e.g. Sigiriya Heritage Villa"
      />

      <div className="grid grid-cols-2 gap-3">
        <Select label="Type" value={form.listingType} onChange={e => set('listingType', e.target.value)}>
          <option value="hotel">Hotel</option>
          <option value="tour">Tour</option>
          <option value="vehicle">Vehicle</option>
        </Select>
        <Input
          label="Region" value={form.region} required
          onChange={e => set('region', e.target.value)}
          placeholder="e.g. Kandy"
        />
      </div>

      <Input
        label="Address / Location" value={form.address || ''}
        onChange={e => set('address', e.target.value)}
        placeholder="e.g. 12 Temple Road, Kandy"
      />

      <Textarea
        label="Description" value={form.description} required rows={3}
        onChange={e => set('description', e.target.value)}
        placeholder="Describe this listing..."
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Price (LKR)" type="number" value={form.price.amount} required min={0}
          onChange={e => setPrice('amount', e.target.value)}
        />
        <Select label="Price Unit" value={form.price.unit} onChange={e => setPrice('unit', e.target.value)}>
          <option value="per_night">Per Night</option>
          <option value="per_person">Per Person</option>
          <option value="per_day">Per Day</option>
        </Select>
      </div>

      <Input
        label="Rating (0–5)" type="number" value={form.rating}
        onChange={e => set('rating', e.target.value)}
        min={0} max={5} step={0.1}
        placeholder="0.0 — customers build this via reviews"
      />

      {form.listingType === 'hotel' && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hotel Options</p>
          <Textarea
            label="Room Types (one per line)"
            value={optText.roomTypes || ''} rows={3}
            onChange={e => setOpt('roomTypes', e.target.value)}
            placeholder={"Deluxe Room\nSuite\nStandard Room"}
          />
          <Textarea
            label="Amenities (one per line)"
            value={optText.amenities || ''} rows={3}
            onChange={e => setOpt('amenities', e.target.value)}
            placeholder={"Free WiFi\nSwimming Pool\nBreakfast Included"}
          />
        </div>
      )}

      {form.listingType === 'tour' && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tour Options</p>
          <Textarea
            label="What's Included (one per line)"
            value={optText.includes || ''} rows={4}
            onChange={e => setOpt('includes', e.target.value)}
            placeholder={"Transport\nGuide\nLunch\nEntrance Fees"}
          />
        </div>
      )}

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
