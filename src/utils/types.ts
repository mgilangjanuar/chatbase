import { User } from '@supabase/supabase-js'

export interface UserProfile extends User {
  profile: Record<string, string>
}

export interface ChatStyles {
  sidebarStyle?: React.CSSProperties,
  conversationAvatarStyle?: React.CSSProperties,
  conversationContentStyle?: React.CSSProperties,
  chatContainerStyle?: React.CSSProperties
}