import AddContactForm from '@/components/AddContactForm'
import { UserPlus } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <section className='pt-8'>
        <h1 className='font-bold text-6xl mb-8'>Добавить контакт</h1>
        <AddContactForm>
            <UserPlus className='size-4 mr-2' /> Добавить
        </AddContactForm>
    </section>
  )
}

export default page