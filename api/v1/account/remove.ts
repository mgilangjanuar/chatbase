import { User } from '@supabase/supabase-js'
import { Request, Response } from 'express'
import { authorize } from '../../middlewares/authorize'
import { supabase } from '../../services/supabase'

export default async function (req: Request, res: Response) {
  let userAuth: User
  try {
    userAuth = await authorize(req)
  } catch (error) {
    return res.status(400).send(error)
  }

  await supabase.from('chat_messages').delete().eq('profile_id', userAuth.id)
  await supabase.from('chat_rooms').update({ admin_id: null }).eq('admin_id', userAuth.id)
  await supabase.from('chat_authenticators').delete().eq('profile_id', userAuth.id)
  await supabase.from('chat_profiles').delete().eq('id', userAuth.id)
  await supabase.auth.api.deleteUser(userAuth.id)
  return res.send({ accepted: true })
}