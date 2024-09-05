import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

function CustomIconPicker() {
  return (
    <Picker data={data} onEmojiSelect={console.log} />
  )
}

export default CustomIconPicker;