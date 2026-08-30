CREATE POLICY "read own productions" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'productions' AND (storage.foldername(name))[1] = auth.uid()::text);