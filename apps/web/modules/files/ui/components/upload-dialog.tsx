"use client"

import { useAction } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";

interface UploadDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void
    onFileUploaded?: () => void
}

export const UploadDialog = ({
    open,
    onOpenChange,
    onFileUploaded
}: UploadDialogProps) => {
    const addFile = useAction(api.private.files.addFile)

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [uploadForm, setUploadForm] = useState({
        categroy: "",
        filename: ""
    })

    const handleFileDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]

        if (file) {
            setUploadedFiles([file])
            // TODO: 这是什么意思
            if (!uploadForm.filename) {
                setUploadForm((prev) => ({...prev, filename: file.name}))
            }
        }
    }
}