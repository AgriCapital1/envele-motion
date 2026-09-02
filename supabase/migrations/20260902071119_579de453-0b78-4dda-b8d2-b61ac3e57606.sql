CREATE POLICY "references read own"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'references' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "references insert own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'references' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "references update own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'references' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'references' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "references delete own"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'references' AND auth.uid()::text = (storage.foldername(name))[1]);