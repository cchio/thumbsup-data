'use client'

import React, { useState } from "react";
import { Modal, useModal } from '@geist-ui/core'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  IconVercel
} from '@/components/ui/icons'
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["TXT", "CSV"];
 
export default function UploadModal() {
  const { visible, setVisible, bindings } = useModal()

  const [file, setFile] = useState(null)

  const handleChange = (file:any) => {
    setFile(file);
  };
 
  return (
    <>
      <Modal {...bindings}>
        <Modal.Title>Upload CSVs here</Modal.Title>
        <Modal.Content>
          <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>Cancel</Modal.Action>
        <Modal.Action>Submit</Modal.Action>
      </Modal>
      <a
        onClick={() => setVisible(true)}
        className={cn(buttonVariants())}
      >
        <IconVercel className="mr-2" />
        <span className="hidden sm:block">Upload CSV</span>
        <span className="sm:hidden">Upload</span>
      </a>
    </>
  )
}