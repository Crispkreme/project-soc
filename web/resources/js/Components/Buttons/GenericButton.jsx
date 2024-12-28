import { memo } from "react";

export default memo(function GenericButton({className='',disabled=false, children, ...props}) {
  return (
    <button disabled={disabled} {...props} className={`${className} bg-secondary-bg hover:bg-primary-bg hover:text-white max-h-max transition rounded-full border-2 border-black `}>
      {children}
    </button>
  )
});