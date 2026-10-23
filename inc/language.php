<?php
declare(strict_types=1);

// Website copy is available independently of published business translations.
function te_language(): string {
    $requested = $_GET['lang'] ?? $_COOKIE['teknikel_language'] ?? 'tr';
    return $requested === 'en' ? 'en' : 'tr';
}
function te_dictionary(): array {
    static $words;
    return $words ??= json_decode((string) file_get_contents(dirname(__DIR__) . '/assets/i18n/en.json'), true, 512, JSON_THROW_ON_ERROR);
}
function te_text(string $source, array $values = []): string {
    $text = te_language() === 'en' ? (te_dictionary()[$source] ?? $source) : $source;
    return preg_replace_callback('/\{(\w+)\}/', static fn($match) => array_key_exists($match[1], $values) ? (string) $values[$match[1]] : $match[0], $text);
}
function te_t(string $source, array $values = []): string {
    return htmlspecialchars(te_text($source, $values), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function te_prepare_language(): void {
    if (headers_sent()) return;
    header('Cache-Control: private, no-store');
    if (isset($_GET['lang']) && is_string($_GET['lang']) && in_array($_GET['lang'], ['tr','en'], true)) {
        setcookie('teknikel_language', te_language(), ['expires'=>time()+31536000, 'path'=>'/',
            'secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', 'httponly'=>true, 'samesite'=>'Lax']);
    }
}
function te_language_url(string $language): string {
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    // Keep relative, same-site links even with an unusual request target.
    $path = '/' . ltrim($path, '/');
    $query = $_GET;
    $query['lang'] = $language;
    return $path . '?' . http_build_query($query);
}
