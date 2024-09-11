# receipts

## Env Vars

```bash
USERNAME=username
PASSWORD=password
URL_SECRET_TOKEN=some_token
```

## Todo

1. Update HTPL to enable whitelisting of approved file types for uploads

2. Update Xerus to better handle network timeouts, especially in regards to trying to access a null value in XerusContext which triggers a timeout when one has not occured.

3. Update HTPL to enable _active-link to allow a "flex" option where hrefs do not have to match exactly, but can be close enough. For example, if _active-links href has parameters within it, it may not indicate as active due to not exactly matching. So enable to ability for some flexibility here.