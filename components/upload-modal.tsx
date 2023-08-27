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
try {
      const data = new FormData()
      data.set('file', (file as any))

      const res = await fetch('/api/table/add', {
        method: 'POST',
        body: data
      })

      // Handle errors
      if (!res.ok) {
        toast.error(await res.text());
      }
    } catch (e: any) {
      toast.error('Encountered unknown error')
      console.error(e)
    }

    setVisible(false);
    handleChange(null);
    toast.success(`Successfully uploaded ${(file as any).name}`)
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
        <Modal.Action onClick={ () => handleSubmit() }>Submit</Modal.Action>
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