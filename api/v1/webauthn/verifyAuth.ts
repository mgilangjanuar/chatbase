import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { User } from '@supabase/supabase-js'
import moment from 'moment'
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

  const { data: authenticators, error } = await supabase
    .from('chat_authenticators')
    .select('*')
    .eq('profile_id', userAuth.id)
    .eq('credential_id', req.body.id)
  if (!authenticators || error) {
    return res.status(500).send(error)
  }
  const authenticator = authenticators[0]

  const verification = await verifyAuthenticationResponse({
    credential: req.body,
    expectedChallenge: user.auth_challenge,
    expectedOrigin: ORIGINS,
    expectedRPID: RP_ID,
    authenticator: {
      credentialPublicKey: Buffer.from(authenticator.data.credentialPublicKey),
      credentialID: Buffer.from(authenticator.data.credentialID),
      counter: authenticator.data.counter
    },
  })

  if (verification.verified) {
    await supabase
      .from('chat_authenticators')
      .update({
        valid_until: moment().add('6', 'hours').toISOString(),
        data: {
          ...authenticator.data,
          counter: verification.authenticationInfo.newCounter
        }
      })
      .eq('id', authenticator.id)
  }

  await supabase
    .from('chat_profiles')
    .update({ auth_challenge: null })
    .eq('id', userAuth.id)

  return res.send(verification)
}