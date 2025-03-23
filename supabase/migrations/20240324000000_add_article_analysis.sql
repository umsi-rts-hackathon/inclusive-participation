-- Create article_analysis table
CREATE TABLE IF NOT EXISTS article_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    political_bias FLOAT NOT NULL CHECK (political_bias >= -10 AND political_bias <= 10),
    location_city TEXT,
    location_state TEXT,
    location_country TEXT,
    confidence_score FLOAT NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(article_id)
);

-- Add RLS policies
ALTER TABLE article_analysis ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read article analysis
CREATE POLICY "Allow public read access to article analysis"
    ON article_analysis FOR SELECT
    USING (true);

-- Only allow authenticated users to insert/update
CREATE POLICY "Allow authenticated users to insert article analysis"
    ON article_analysis FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update article analysis"
    ON article_analysis FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_article_analysis_updated_at
    BEFORE UPDATE ON article_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 