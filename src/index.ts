import { findByProps } from "@vendetta/metro";
import { i18n } from "@vendetta/metro/common";
import { instead } from "@vendetta/patcher";

let unpatch: () => void;

export default {
    onLoad: () => {
        // Find the Popup object to override its show method
        const Popup = findByProps("show", "openLazy");
        
        // Patch the show method to bypass the confirmation
        unpatch = instead("show", Popup, (args, fn) => {
            // Check if the popup is asking for message deletion confirmation
            if (args?.[0]?.title === i18n.Messages.DELETE_MESSAGE) {
                // Automatically confirm the deletion
                args[0].onConfirm?.();
            } else {
                // Otherwise, run the default function
                fn(...args);
            }
        });
    },
    onUnload: () => {
        // Unpatch the changes when the plugin is unloaded
        unpatch?.();
    }
};
