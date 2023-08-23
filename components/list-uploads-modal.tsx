'use client'

import React, { useState } from "react";
import { Modal, useModal } from '@geist-ui/core'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { List } from '@geist-ui/icons'
 
export default function ListUploadsModal() {
  const { visible, setVisible, bindings } = useModal()
 
  return (
    <>
      <Modal {...bindings}>
        <Modal.Title>Uploaded files</Modal.Title>
        <Modal.Content>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>Cancel</Modal.Action>
        <Modal.Action>Submit</Modal.Action>
      </Modal>
      <a
        onClick={() => setVisible(true)}
        className={cn(buttonVariants())}
      >
        <List size={16} className="mr-2" />
        <span className="hidden sm:block">List files</span>
        <span className="sm:hidden">Files</span>
      </a>
    </>
  )
}