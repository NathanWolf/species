<?php
if (!isset($_REQUEST['title'])) {
    die(json_encode(array('success' => false, 'message' => 'Missing title parameter')));
}

$title = $_REQUEST['title'];
$wikiContent = file_get_contents('http://en.wikipedia.org/w/api.php?action=query&format=json&prop=images|extracts&redirects&titles=' . $title);
if ($wikiContent) $wikiContent = json_decode($wikiContent, true);
if (!$wikiContent || !isset($wikiContent['query']) || !isset($wikiContent['query']['pages'])) {
    die(json_encode(array('success' => false, 'message' => 'Failed to contact wikipedia')));
}

$response = array('success' => true);
$images = array();
$query = $wikiContent['query'];

if (isset($query['redirects'])) {
    foreach ($query['redirects'] as $redirect) {
        if ($redirect['from'] != $redirect['to']) {
            $response['redirect'] = $redirect['to'];
            break;
        }
    }
}

$pages = $query['pages'];
foreach ($pages as $page) {
    if (isset($page['images'])) {
        foreach ($page['images'] as $image) {
            array_push($images, urlencode($image['title']));
        }
    }
    if (isset($page['extract'])) {
        $response['extract'] = $page['extract'];
    }
}

$imageQuery = implode('|', $images);
$images = array();
$resolvedImages = file_get_contents('http://en.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&titles=' . $imageQuery);
if ($resolvedImages) $resolvedImages = json_decode($resolvedImages, true);
if ($resolvedImages && isset($resolvedImages['query']) && isset($resolvedImages['query']['pages'])) {
    $imagePages = $resolvedImages['query']['pages'];
    foreach ($imagePages as $imagePage) {
        if (!isset($imagePage['title']) || !isset($imagePage['imageinfo'])) continue;
        $url = null;
        foreach ($imagePage['imageinfo'] as $imageInfo) {
            if (isset($imageInfo['url'])) {
                $url = $imageInfo['url'];
            }
            break;
        }
        if (!$url) continue;
        array_push($images, array(
            'title' => $imagePage['title'],
            'url' => $url
        ));
    }
} else {
    $response['message'] = 'Failed to load images';
}

$response['images'] = $images;
echo json_encode($response);

