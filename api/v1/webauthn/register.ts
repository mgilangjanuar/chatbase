import { generateRegistrationOptions } from '@simplewebauthn/server'
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types'
import { User } from '@supabase/supabase-js'
import { Request, Response } from 'express'
import { authorize } from '../../middlewares/authorize'
import { supabase } from '../../services/supabase'
import { RP_ID, RP_NAME } from '../../utils/Constant'

export default async function (req: Request, res: Response) {
  let userAuth: User
  try {
    userAuth = await authorize(req)
  } catch (error) {
    return res.status(400).send(error)
  }

  const { data: profiles, error: errorProfiles } = await supabase
    .from('chat_profiles')
    .select('*')
    .eq('id', userAuth.id)
  if (!profiles || errorProfiles) {
    return res.status(500).send(errorProfiles)
  }

  const user = profiles[0]

  const { data: authenticators, error } = await supabase
    .from('chat_authenticators')
    .select('*')
    .eq('profile_id', user.id)
  if (!authenticators || error) {
    return res.status(500).send(error)
  }

  let options: PublicKeyCredentialCreationOptionsJSON
  try {
    options = generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: user.id,
      userName: user.name,
      userDisplayName: user.username,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: 'none',
      // Prevent users from re-registering existing authenticators
      excludeCredentials: authenticators.map(authenticator => ({
        id: authenticator.data.credentialID,
        type: 'public-key',
        // Optional
        // transports: authenticator.data.transports,
      })),
    })
  } catch (error) {
    return res.status(500).send(error)
  }

  const { error: errorUpdatedProfile } = await supabase
    .from('chat_profiles')
    .update({ auth_challenge: options.challenge })
    .eq('id', user.id)

  if (errorUpdatedProfile) {
    return res.status(500).send(errorUpdatedProfile)
  }

  return res.send(options)
}