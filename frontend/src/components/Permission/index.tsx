'use client'
import React, { useContext } from 'react'
import GlobalContext from '@/utils/globalContext';

interface IPermission {
  aclKey: string;
  children: React.ReactElement;
}

export default function Permission({ aclKey, children }: IPermission) {
  const context = useContext(GlobalContext);

  return (
    <>
      {children}
    </>
  )
}
