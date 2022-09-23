import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { User } from '@supabase/supabase-js'
import { Request, Response } from 'express'
import { authorize } from '../../middlewares/authorize'
import { supabase } from '../../services/supabase'
import { ORIGINS, RP_ID } from '../../utils/Constant'

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
  const expectedChallenge = user.auth_challenge
  const { device_name: name, ...credential } = req.body

  const verification = await verifyRegistrationResponse({
    credential,
    expectedChallenge,
    expectedOrigin: ORIGINS,
    expectedRPID: RP_ID
  })

  if (verification.verified && verification.registrationInfo) {
    await supabase
      .from('chat_authenticators')
      .insert({
        name,
        credential_id: Buffer.from(verification.registrationInfo.credentialID).toString('base64url'),
        data: {
          credentialPublicKey: verification.registrationInfo.credentialPublicKey,
          credentialID: verification.registrationInfo.credentialID,
          counter: verification.registrationInfo.counter
        },
        profile_id: user.id
      })
    await supabase
      .from('chat_profiles')
      .update({ auth_challenge: null })
      .eq('id', user.id)
  }

  return res.send(verification)
}