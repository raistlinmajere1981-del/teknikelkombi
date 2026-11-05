<?php
declare(strict_types=1);

const SITE_SOURCE_CATALOG_ID = 'teknikel-site';
const SITE_LANGUAGE_COOKIE = 'teknikel_site_language';
const RETIRED_SITE_LANGUAGE_COOKIE = 'teknikel_language';

// SSR is always Turkish. Only the app's public business GET authorizes a target.
function te_language(): string {
    return 'tr';
}
function te_text(string $source, array $values = []): string {
    return preg_replace_callback('/\{(\w+)\}/', static fn($match) => array_key_exists($match[1], $values) ? (string) $values[$match[1]] : $match[0], $source);
}
function te_t(string $source, array $values = []): string {
    return htmlspecialchars(te_text($source, $values), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function te_prepare_language(): void {
    if (headers_sent()) return;
    header('Cache-Control: private, no-store');
    // The retired host-only cookie was HttpOnly; client JavaScript cannot clear it.
    setcookie(RETIRED_SITE_LANGUAGE_COOKIE, '', ['expires'=>time()-3600, 'path'=>'/', 'domain'=>'',
        'secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', 'httponly'=>true, 'samesite'=>'Lax']);
}

/** Local, public source catalog for Desktop Web Connect. No API or credential. */
function site_source_catalog(): array {
    static $catalog;
    if (is_array($catalog)) return $catalog;
    $file = dirname(__DIR__) . '/assets/i18n/tr.json';
    $decoded = is_file($file) ? json_decode((string) file_get_contents($file), true, 512) : null;
    $entries = [];
    foreach (is_array($decoded['entries'] ?? null) ? $decoded['entries'] : [] as $key => $entry) {
        if (!is_string($key) || !preg_match('/^[a-zA-Z0-9_.-]{1,120}$/D', $key) || !is_array($entry)) continue;
        $text = $entry['text'] ?? null;
        if (!is_string($text) || trim($text) === '' || mb_strlen($text, 'UTF-8') > 12000
            || preg_match('/[<>\x00-\x08]/u', $text)) continue;
        $hash = hash('sha256', $text);
        if (($entry['hash'] ?? null) !== $hash || $key !== 'phrase.' . $hash) continue;
        $entries[$key] = ['text' => $text, 'hash' => $hash];
    }
    ksort($entries, SORT_STRING);
    $revision = '';
    foreach ($entries as $key => $entry) $revision .= $key . ':' . $entry['hash'] . "\n";
    return $catalog = ['version' => 1, 'id' => SITE_SOURCE_CATALOG_ID, 'revision' => hash('sha256', $revision),
        'source_language' => 'tr', 'entries' => $entries];
}
