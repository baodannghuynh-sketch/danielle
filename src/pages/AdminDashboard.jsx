import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseclient'
import ProductForm from '../components/Admin/ProductForm'
import ProductList from '../components/Admin/ProductList'

export default function AdminDashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) navigate('/login')
    })
  }, [navigate])

  return (
    <div style={{ padding: '120px 40px 80px', maxWidth: '1200px', margin: 'auto' }}>
      <h1 style={{ fontSize: '42px', color: '#A51C30', textAlign: 'center', marginBottom: '50px' }}>
        DANIELLE ADMIN PANEL
      </h1>
      <ProductForm />
      <hr style={{ margin: '60px 0' }} />
      <ProductList />
    </div>
  )
}