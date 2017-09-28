Analytics = if ENV.fetch("SEGMENT_WRITE_KEY")
  SimpleSegment::Client.new({
    write_key: ENV.fetch("SEGMENT_WRITE_KEY")
  })
else
  nil
end