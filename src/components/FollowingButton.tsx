import { splitProps } from 'solid-js'
import { IProfile } from '../api/RealWorldApi'

interface IFollowingButtonProps {
  profile: IProfile
  onClick: (e: InputEvent) => void
}

export const FollowingButton = (props: IFollowingButtonProps) => {
  const [local] = splitProps(props, ['profile', 'onClick'])
  return (
    <button
      class="btn btn-sm action-btn"
      classList={{
        'btn-secondary': local.profile?.following,
        'btn-outline-secondary': !local.profile?.following
      }}
      onClick={local.onClick}
    >
      <i class="ion-plus-round" /> {local.profile?.following ? 'Unfollow' : 'Follow'} {local.profile?.username}
    </button>
  )
}
