'use client'

import { buttonVariants } from '@/components/ui/button'
import { cn, humanFileSize } from '@/lib/utils'
import { FileText } from '@geist-ui/icons'
import { FileUploader } from "react-drag-drop-files";
import { Modal, useModal } from '@geist-ui/core'
import { toast } from 'react-hot-toast'
import React, { useState } from "react";

const fileTypes = ["TXT", "CSV"];
 
export default function UploadModal() {
  const { visible, setVisible, bindings } = useModal()

  const [file, setFile] = useState<File>()

  const handleChange = (f:any) => {
    setFile(f);
  };

  const handleSubmit = async () => {
    if (file !== null) {
      const data = new FormData()
      data.set('file', (file as any))

      // Send file to server for processing (adding to table)
      fetch('/api/table/add', {
        method: 'POST',
        body: data
      })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          toast.success(`Successfully uploaded ${(file as any).name}`)
        } else {
          toast.error(`Upload or processing of ${(file as any).name} failed`)
        }
      })
      .catch((err) => {
        toast.error('Encountered unknown error')
        console.error(err)
      })
    }

    // Reset other state
    setVisible(false);
    handleChange(null);
  }
 
  return (
    <>
      <Modal {...bindings}>
        <Modal.Title>Upload CSV</Modal.Title>
        <Modal.Content>
          <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
            <p className="pt-4 text-xs text-muted-foreground">
              { file == null ? '' : `File uploaded: ${(file as any).name} (${humanFileSize((file as any).size)})` }
            </p>
        </Modal.Content>
        <Modal.Action passive onClick={ () => setVisible(false) }>Cancel</Modal.Action>
        <Modal.Action disabled={ file == null } onClick={ () => handleSubmit()}>Submit</Modal.Action>
      </Modal>
      <a
        onClick={() => {
          setVisible(true);
          handleChange(null);
        }}
        className={cn(buttonVariants())}
      >
        <FileText size={16}  className="mr-2" />
        <span className="hidden sm:block">Upload CSV</span>
        <span className="sm:hidden">Upload</span>
      </a>
    </>
  )
}