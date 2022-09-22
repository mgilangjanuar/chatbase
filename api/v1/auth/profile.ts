import { User } from '@supabase/supabase-js'
import { Request, Response } from 'express'
import { authorize } from '../../middlewares/authorize'
import { supabase } from '../../services/supabase'

export default async function (req: Request, res: Response) {
  let user: User
  try {
    user = await authorize(req) as User
  } catch (error) {
    return res.status(401).send(error)
  }

  // find the user in the database
  const { data, error } = await supabase.from('chat_profiles').select().eq('username', user.user_metadata.email)
  if (!data || error) {
    return res.status(500).send({ error: error || 'Something error' })
  }

  // create a new profile if one doesn't exist
  if (data.length === 0) {
    const { data, error } = await supabase.from('chat_profiles').insert({
      id: user.id,
      username: user.user_metadata.email,
      name: user.user_metadata.full_name,
      img_url: user.user_metadata.avatar_url
    })
    if (error) {
      return res.status(500).send({ error })
    }
    return res.status(200).send({ profile: data?.[0] })
  }

  return res.send({ profile: data[0] })
}