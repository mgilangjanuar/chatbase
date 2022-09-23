import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types'
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

  const { data: authenticators, error } = await supabase
    .from('chat_authenticators')
    .select('*')
    .eq('profile_id', userAuth.id)
  if (!authenticators || error) {
    throw error
  }

  let options: PublicKeyCredentialRequestOptionsJSON
  try {
    options = generateAuthenticationOptions({
      // Require users to use a previously-registered authenticator
      allowCredentials: authenticators.map(authenticator => ({
        id: authenticator.data.credentialID,
        type: 'public-key',
        // Optional
        // transports: authenticator.transports,
      })),
      userVerification: 'preferred',
    })
  } catch (error) {
    return res.status(400).send(error)
  }

  await supabase
    .from('chat_profiles')
    .update({ auth_challenge: options.challenge })
    .eq('id', userAuth.id)

  return res.send(options)
}