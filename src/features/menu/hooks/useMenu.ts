import { useQuery, useMutation } from '@tanstack/react-query';
import { menuApi, type PresignedUrlMapping } from '@/features/menu/api/menuApi';
import type { CloudMenuDiffPayload, CloudMenuGetPayload } from '@/features/menu/types/sync.types';

export const MENU_QUERY_KEY = ['menuData'];

interface CompositeUploadArgs {
  diffPayload: CloudMenuDiffPayload;
  localPageFilesMap: Record<string, File>;
}

export function useMenu(){
    // const queryClient = useQueryClient();

    // Fetch the Master Snapshot
  const { data: firstSnapshot, isLoading, isError } = useQuery({
    queryKey: MENU_QUERY_KEY,
    queryFn: menuApi.fetchMenuDataset,
    staleTime: Infinity, // Maintain snapshot integrity while user edits
  });

  // Mutation to send ONLY the calculated delta diff
  const mutation = useMutation({
    mutationFn: async({diffPayload, localPageFilesMap}: CompositeUploadArgs) =>{

        let syncResponseData: { presignedUrls: PresignedUrlMapping[] } | null = null;
        
        syncResponseData = await menuApi.pushMenuDeltaChanges(diffPayload);
        
        console.log('🔎  Received response with presigned URLs', syncResponseData);
        
        // ☁️ HOP 2: Process binary media streaming to S3 concurrently for ultra-high performance
        if (syncResponseData.presignedUrls && syncResponseData.presignedUrls.length > 0) {
            console.log('⚡ Concurrently streaming binaries dirWectly to cloud S3 buckets...');
            
            await Promise.all(
                syncResponseData.presignedUrls.map(async (mapping) => {
                    const fileToUpload = localPageFilesMap[mapping.pageId];
                    if (!fileToUpload) return; // Guard: file reference missing locally

                    console.log('🔎  Image ID to upload', mapping.pageId);
                    console.log('🔎  Image URL for uploading', mapping.uploadUrl);

                    try {
                    await menuApi.uploadImageToS3(mapping.uploadUrl.replaceAll("172.18.0.2", "localhost"), fileToUpload); // TODO: Move that replacement fix to the backend, it shouldn't be here
                    } catch (s3UploadError) {
                    throw new Error(`S3_UPLOAD_FAILURE|${mapping.pageId}|${s3UploadError instanceof Error ? s3UploadError.message : ''}`);
                    }
                })
            );

            console.log('✅🖼️  All images where successfully processed');
        }

        return syncResponseData
         
    },

    // onSuccess: (syncResponseData) => {  /// It will be useful when the more than 1 person modify the menu at the same time.
    // }
  });

  return {
    firstSnapshot,
    isLoading,
    isError,
    isUploading: mutation.isPending,
    uploadPatch: mutation.mutateAsync,
  };

}