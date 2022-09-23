import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { AuthenticationCredentialJSON, RegistrationCredentialJSON } from '@simplewebauthn/typescript-types'
import { useState } from 'react'
import { req } from '../utils/request'
import { UserProfile } from '../utils/types'

export default function (onFinish: (user: UserProfile, err?: any) => void, user?: UserProfile) {
  const [loading, setLoading] = useState<boolean>(false)

  const register = async (name?: string) => {
    if (!user) return

    setLoading(true)
    try {
      const { data: options } = await req().post('/webauthn/register')
      const resp: RegistrationCredentialJSON = await startRegistration(options)

      const { data: verification } = await req().post('/webauthn/verifyRegister', {
        device_name: name, ...resp })
      if (!verification.verified) {
        throw { message: 'Verification failed' }
      }
      setLoading(false)
      return onFinish(user)
    } catch (error: any) {
      setLoading(false)
      return onFinish(user, error)
    }
  }

  const auth = async (u: UserProfile | undefined = user) => {
    if (!u) return

    setLoading(true)
    try {
      const { data: options } = await req().post('/webauthn/auth')
      const resp: AuthenticationCredentialJSON = await startAuthentication(options)

      const { data: verification } = await req().post('/webauthn/verifyAuth', resp)
      if (!verification.verified) {
        throw { message: 'Verification failed' }
      }
      window.sessionStorage.setItem('credentialId', resp.id)
      setLoading(false)
      return onFinish(u)
    } catch (error: any) {
      setLoading(false)
      return onFinish(u, error)
    }
  }

  return { register, auth, loading }
}