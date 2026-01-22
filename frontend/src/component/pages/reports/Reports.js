import React from 'react'
import CustomReports from './CustomReports'
import { useRedirectLogOutUser } from "../../../customHook/useRedirectLogOutUser"
import { useRedirectEmployee } from "../../../customHook/useRedirectEmploye";

export const Reports = () => {
  useRedirectLogOutUser()
  useRedirectEmployee()

  return (
    <div><CustomReports /></div>
  )
}
